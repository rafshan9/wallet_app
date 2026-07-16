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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
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