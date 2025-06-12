import React from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '@/components/Users/UserForm';
import { useUser, useUpdateUser } from '@/hooks/useUsers';
import { UpdateUserRequest } from '@/types/user.types';

export const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id!);
  const updateUserMutation = useUpdateUser();

  const handleSubmit = (userData: UpdateUserRequest) => {
    updateUserMutation.mutate(
      { id: id!, userData },
      {
        onSuccess: () => {
          navigate('/');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container>
        <Alert variant="danger">
          Usuario no encontrado o error al cargar los datos.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h2 className="mb-0">Editar Usuario</h2>
            </Card.Header>
            <Card.Body>
              <UserForm
                user={user}
                onSubmit={handleSubmit}
                isLoading={updateUserMutation.isPending}
                error={updateUserMutation.error?.message}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};