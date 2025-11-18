import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminDashboard from '@/components/AdminDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import ParentDashboard from '@/components/ParentDashboard';

type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | null;

interface User {
  login: string;
  role: UserRole;
  name: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setError('');
    
    if (login !== '22') {
      setError('Неверный логин');
      return;
    }

    let user: User;
    
    if (password === '1qaz2wsx') {
      user = { login: '22', role: 'admin', name: 'Администратор' };
    } else if (password === 'teacher') {
      user = { login: '22', role: 'teacher', name: 'Учитель Иванов И.И.' };
    } else if (password === 'student') {
      user = { login: '22', role: 'student', name: 'Ученик Петров П.П.' };
    } else if (password === 'parent') {
      user = { login: '22', role: 'parent', name: 'Родитель Сидорова С.С.' };
    } else {
      setError('Неверный пароль');
      return;
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLogin('');
    setPassword('');
    localStorage.removeItem('currentUser');
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 animate-scale-in">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Icon name="GraduationCap" size={48} className="text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              КиберШкола
            </CardTitle>
            <p className="text-muted-foreground text-sm">Образовательная платформа будущего</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Логин</label>
              <Input
                type="text"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Пароль</label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}
            <Button 
              onClick={handleLogin} 
              className="w-full h-12 text-base font-medium"
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти в систему
            </Button>
            <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground mb-2">Тестовые доступы:</p>
              <p>• Логин для всех: <span className="font-mono bg-muted px-2 py-0.5 rounded">22</span></p>
              <p>• Админ: <span className="font-mono bg-muted px-2 py-0.5 rounded">1qaz2wsx</span></p>
              <p>• Учитель: <span className="font-mono bg-muted px-2 py-0.5 rounded">teacher</span></p>
              <p>• Ученик: <span className="font-mono bg-muted px-2 py-0.5 rounded">student</span></p>
              <p>• Родитель: <span className="font-mono bg-muted px-2 py-0.5 rounded">parent</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="GraduationCap" size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                КиберШкола
              </h1>
              <p className="text-xs text-muted-foreground">{currentUser.name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <Icon name="LogOut" size={18} />
            Выход
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentUser.role === 'admin' && <AdminDashboard />}
        {currentUser.role === 'teacher' && <TeacherDashboard />}
        {currentUser.role === 'student' && <StudentDashboard />}
        {currentUser.role === 'parent' && <ParentDashboard />}
      </main>
    </div>
  );
};

export default Index;
