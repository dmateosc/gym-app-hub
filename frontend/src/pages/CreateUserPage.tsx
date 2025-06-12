import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '@/components/Users/UserForm';
import { useCreateUser } from '@/hooks/useUsers';
import { CreateUserRequest } from '@/types/user.types';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const handleSubmit = (userData: CreateUserRequest) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h2 className="mb-0">Crear Nuevo Usuario</h2>
            </Card.Header>
            <Card.Body>
              <UserForm
                onSubmit={handleSubmit}
                isLoading={createUserMutation.isPending}
                error={createUserMutation.error?.message}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};