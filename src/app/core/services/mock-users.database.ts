/**
 * Mock Users Database
 *
 * Responsabilidad única: Almacenar y gestionar datos de usuarios mock para desarrollo
 * Puede ser reemplazado fácilmente por llamadas HTTP a un backend real
 */

interface MockUser {
  id: string;
  email: string;
  password: string; // Plain text - solo para demostración
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  createdAt: number;
}

// Base de datos de usuarios mock
export const MOCK_USERS_DATABASE = (() => {
  const STORAGE_KEY = 'shop-mock-users-db';

  // Usuarios iniciales por defecto
  const DEFAULT_USERS: MockUser[] = [
    {
      id: '1',
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      createdAt: Date.now()
    },
    {
      id: '2',
      email: 'jane@example.com',
      password: 'password456',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0987654321',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      createdAt: Date.now()
    }
  ];

  // Cargar desde localStorage o usar defaults
  const loadUsers = (): MockUser[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  let users: MockUser[] = loadUsers();

  // Función para persistir cambios
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error persisting mock database:', error);
    }
  };

  return {
    findByEmail: (email: string): MockUser | undefined => {
      return users.find(u => u.email === email);
    },

    findById: (id: string): MockUser | undefined => {
      return users.find(u => u.id === id);
    },

    addUser: (user: Omit<MockUser, 'id' | 'createdAt'>): MockUser => {
      const newUser: MockUser = {
        ...user,
        id: Date.now().toString(),
        createdAt: Date.now()
      };
      users.push(newUser);
      persist();
      return newUser;
    },

    updateUser: (id: string, updates: Partial<MockUser>): MockUser | undefined => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return undefined;

      users[index] = { ...users[index], ...updates };
      persist();
      return users[index];
    },

    getAllUsers: (): readonly MockUser[] => {
      return [...users];
    }
  };
})();
