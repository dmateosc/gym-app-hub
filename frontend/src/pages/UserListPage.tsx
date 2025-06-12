import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { UserCard } from '@/components/Users/UserCard';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { MembershipType } from '@/types/user.types';

export const UserListPage: React.FC = () => {
  const [membershipFilter, setMembershipFilter] = useState<MembershipType | ''>('');
  const { data: users, isLoading, error } = useUsers(membershipFilter || undefined);
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMembershipFilter(e.target.value as MembershipType | '');
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

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          Error al cargar los usuarios. Por favor, intenta de nuevo.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        <Button variant="primary" href="/users/new">
          + Nuevo Usuario
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filtrar por membresía</Form.Label>
            <Form.Select value={membershipFilter} onChange={handleFilterChange}>
              <option value="">Todas las membresías</option>
              <option value="basic">Básica</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {users && users.length === 0 ? (
        <Alert variant="info">
          No se encontraron usuarios {membershipFilter && `con membresía ${membershipFilter}`}.
        </Alert>
      ) : (
        <Row>
          {users?.map((user) => (
            <Col key={user.id} md={6} lg={4} className="mb-4">
              <UserCard user={user} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};