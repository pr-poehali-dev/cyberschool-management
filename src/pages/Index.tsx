import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminDashboard from '@/components/AdminDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import ParentDashboard from '@/components/ParentDashboard';
import type { User, Teacher, Student, Parent } from '@/types';

type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | null;

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
    
    if (login === 'admin' && password === '1qaz2wsx') {
      const user: User = { login: 'admin', password: '1qaz2wsx', role: 'admin', name: 'Администратор', id: 'admin' };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return;
    }

    const teachers: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]');
    const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
    const parents: Parent[] = JSON.parse(localStorage.getItem('parents') || '[]');

    const teacher = teachers.find(t => t.login === login && t.password === password);
    if (teacher) {
      const user: User = { login: teacher.login, password: teacher.password, role: 'teacher', name: teacher.name, id: teacher.id };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return;
    }

    const student = students.find(s => s.login === login && s.password === password);
    if (student) {
      const user: User = { login: student.login, password: student.password, role: 'student', name: student.name, id: student.id };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return;
    }

    const parent = parents.find(p => p.login === login && p.password === password);
    if (parent) {
      const user: User = { login: parent.login, password: parent.password, role: 'parent', name: parent.name, id: parent.id };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return;
    }

    setError('Неверный логин или пароль');
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
        {currentUser.role === 'teacher' && <TeacherDashboard userId={currentUser.id} />}
        {currentUser.role === 'student' && <StudentDashboard userId={currentUser.id} />}
        {currentUser.role === 'parent' && <ParentDashboard userId={currentUser.id} />}
      </main>
    </div>
  );
};

export default Index;