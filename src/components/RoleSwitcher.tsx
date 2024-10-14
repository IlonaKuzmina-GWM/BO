'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';

const RoleSwitcher: React.FC = observer(() => {
  const { authStore } = useStore();

//   Only show the role switcher if the user is a developer
  if (authStore.role !== 'developer' || 'admin') {
    return null;
  }

  const roles = ['developer', 'admin', 'merchant', 'manager'];

  const handleRoleSwitch = (role: string) => {
    authStore.setSecondRole(role);
  };

  return (
    <div className='bg-divider p-4 rounded-sm'>
      <h3>Switch Role</h3>
      <div>
        {roles.map((role) => (
          <label key={role} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={authStore.secondRole === role}
              onChange={() => handleRoleSwitch(role)}
              style={{ marginRight: '8px' }}
            />
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
});

export default RoleSwitcher;
