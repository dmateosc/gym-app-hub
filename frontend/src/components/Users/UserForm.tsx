import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Alert } from 'react-bootstrap';
import { CreateUserRequest, UpdateUserRequest, User } from '@/types/user.types';

const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  membershipType: z.enum(['basic', 'premium', 'vip']).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  isLoading?: boolean;
  error?: string;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  isLoading = false, 
  error 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      membershipType: user?.membershipType || 'basic',
    },
  });

  const handleFormSubmit = (data: UserFormData) => {
    const formData = {
      ...data,
      phone: data.phone || undefined,
    };
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Nombre completo *</Form.Label>
        <Form.Control
          type="text"
          {...register('name')}
          isInvalid={!!errors.name}
          placeholder="Ingresa el nombre completo"
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email *</Form.Label>
        <Form.Control
          type="email"
          {...register('email')}
          isInvalid={!!errors.email}
          placeholder="ejemplo@email.com"
          disabled={!!user} // No permitir cambiar email al editar
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          {...register('phone')}
          isInvalid={!!errors.phone}
          placeholder="+1234567890"
        />
        <Form.Control.Feedback type="invalid">
          {errors.phone?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Tipo de membresía</Form.Label>
        <Form.Select {...register('membershipType')} isInvalid={!!errors.membershipType}>
          <option value="basic">Básica</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.membershipType?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : user ? 'Actualizar' : 'Crear Usuario'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
      </div>
    </Form>
  );
};