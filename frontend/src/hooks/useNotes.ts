import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/axios';

export type Note = {
    id: string;
    content: string;
    createdAt: string;
};

export function useNotes() {
    const queryClient = useQueryClient();

    const { data: notes = [], isLoading, refetch } = useQuery<Note[]>({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await api.get('/notes/');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: (content: string) => api.post('/notes/', { content }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => api.patch(`/notes/${id}/`, { content }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/notes/${id}/`),
        onMutate: async (deletedId) => {
            // Cancel outgoing refetches so they don't overwrite optimistic update
            await queryClient.cancelQueries({ queryKey: ['notes'] });

            // Snapshot previous value
            const previousNotes = queryClient.getQueryData<Note[]>(['notes']);

            // Optimistically remove the note from the cache
            queryClient.setQueryData(['notes'], (old: Note[] = []) =>
                old.filter((n) => n.id !== deletedId)
            );

            return { previousNotes };
        },
        onError: (err, deletedId, context) => {
            // Roll back to previous notes if the delete fails
            if (context?.previousNotes) {
                queryClient.setQueryData(['notes'], context.previousNotes);
            }
        },
        // We removed onSuccess: () => queryClient.invalidateQueries(...) 
        // to stop the cache from resetting and wiping the 'temp-' note.
    });

    return {
        notes,
        isLoading,
        fetchNotes: refetch,
        createNote: createMutation.mutateAsync,
        updateNote: updateMutation.mutateAsync,
        deleteNote: deleteMutation.mutateAsync,
    };
}

// Added missing hook
export const useAddVoiceNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            // 1. Upload audio and get the transcription back
            const voiceRes = await api.post('/notes/voice/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // 2. Save the transcribed text to the database 
            const res = await api.post('/notes/', {
                content: voiceRes.data.text // Ensure '.text' matches your Django response key
            });

            return res.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['notes'] });
            const previousNotes = queryClient.getQueryData<Note[]>(['notes']);

            const placeholderNote: Note = {
                id: `temp-${Date.now()}`,
                content: "Transcribing...",
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData(['notes'], (old: Note[] | undefined) => [
                placeholderNote,
                ...(old || []),
            ]);

            return { previousNotes };
        },
        onError: (err, variables, context) => {
            if (context?.previousNotes) {
                queryClient.setQueryData(['notes'], context.previousNotes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};