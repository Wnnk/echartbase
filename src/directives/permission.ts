
interface permissionConfig {
  level: number;
  inherits?: string[];
}

export  const permission = {
  mounted(el: HTMLElement,binding: any) {
    const {value: requiredPermission} = binding;
    const userPermission = localStorage.getItem('permission');
    if(!userPermission) return;
    const permissionConfig:Record<string,permissionConfig> = {
      'user':{ level: 1 },
      'admin':{ level: 2, inherits: ['user'] },
      'boss':{ level: 3, inherits: ['admin','user'] }
    };
    const hasPermission = (userPerm:string,requiredPerm:string):boolean => {
      if(userPerm === requiredPerm) return true;
      const userConfig = permissionConfig[userPerm];
      const requiredConfig = permissionConfig[requiredPerm];
      if(!userConfig ||!requiredConfig) return false;
      if(userConfig.level > requiredConfig.level) return true;
      return userConfig.inherits?.includes(requiredPerm) || false;
    };
    if(!hasPermission(userPermission,requiredPermission)){
      el.parentNode?.removeChild(el);
    }
  }
}