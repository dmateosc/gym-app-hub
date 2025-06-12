import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { User } from '@/types/user.types';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  const navigate = useNavigate();

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'vip': return 'warning';
      case 'premium': return 'info';
      case 'basic': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{user.name}</Card.Title>
          <Badge bg={getMembershipColor(user.membershipType)} className="text-uppercase">
            {user.membershipType}
          </Badge>
        </div>
        
        <Card.Text className="text-muted mb-1">
          📧 {user.email}
        </Card.Text>
        
        {user.phone && (
          <Card.Text className="text-muted mb-1">
            📱 {user.phone}
          </Card.Text>
        )}
        
        <Card.Text className="text-muted mb-3">
          📅 Miembro desde: {formatDate(user.joinDate)}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <Badge bg={user.isActive ? 'success' : 'danger'}>
            {user.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          
          <div className="btn-group">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => navigate(`/users/edit/${user.id}`)}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(user.id)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};