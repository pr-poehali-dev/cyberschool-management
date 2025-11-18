import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Class, Student, Teacher, Parent, Schedule, Homework } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClasses(JSON.parse(localStorage.getItem('classes') || '[]'));
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    setTeachers(JSON.parse(localStorage.getItem('teachers') || '[]'));
    setParents(JSON.parse(localStorage.getItem('parents') || '[]'));
    setSchedules(JSON.parse(localStorage.getItem('schedules') || '[]'));
    setHomeworks(JSON.parse(localStorage.getItem('homeworks') || '[]'));
  };

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addClass = (name: string, grade: number) => {
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      grade,
      students: []
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    saveToLocalStorage('classes', updated);
  };

  const addStudent = (name: string, classId: string, login: string, password: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      classId,
      grades: {},
      login,
      password
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveToLocalStorage('students', updatedStudents);

    const updatedClasses = classes.map(c => 
      c.id === classId ? { ...c, students: [...c.students, newStudent.id] } : c
    );
    setClasses(updatedClasses);
    saveToLocalStorage('classes', updatedClasses);
  };

  const addTeacher = (name: string, subjects: string[], login: string, password: string, classIds: string[]) => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name,
      subjects,
      classIds,
      login,
      password
    };
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    saveToLocalStorage('teachers', updated);
  };

  const addParent = (name: string, childrenIds: string[], login: string, password: string) => {
    const newParent: Parent = {
      id: Date.now().toString(),
      name,
      childrenIds,
      login,
      password
    };
    const updated = [...parents, newParent];
    setParents(updated);
    saveToLocalStorage('parents', updated);

    const updatedStudents = students.map(s =>
      childrenIds.includes(s.id) ? { ...s, parentId: newParent.id } : s
    );
    setStudents(updatedStudents);
    saveToLocalStorage('students', updatedStudents);
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    const updated = teachers.map(t => t.id === id ? { ...t, ...data } : t);
    setTeachers(updated);
    saveToLocalStorage('teachers', updated);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    const updated = students.map(s => s.id === id ? { ...s, ...data } : s);
    setStudents(updated);
    saveToLocalStorage('students', updated);
  };

  const updateParent = (id: string, data: Partial<Parent>) => {
    const updated = parents.map(p => p.id === id ? { ...p, ...data } : p);
    setParents(updated);
    saveToLocalStorage('parents', updated);
  };

  const deleteTeacher = (id: string) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    saveToLocalStorage('teachers', updated);
  };

  const deleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveToLocalStorage('students', updated);

    const updatedClasses = classes.map(c => ({
      ...c,
      students: c.students.filter(sid => sid !== id)
    }));
    setClasses(updatedClasses);
    saveToLocalStorage('classes', updatedClasses);
  };

  const deleteParent = (id: string) => {
    const updated = parents.filter(p => p.id !== id);
    setParents(updated);
    saveToLocalStorage('parents', updated);
  };

  const addSchedule = (classId: string, day: string, time: string, subject: string, teacherId: string) => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      classId,
      day,
      time,
      subject,
      teacherId
    };
    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    saveToLocalStorage('schedules', updated);
  };

  const addHomework = (classId: string, subject: string, description: string, deadline: string, teacherId: string) => {
    const newHomework: Homework = {
      id: Date.now().toString(),
      classId,
      subject,
      description,
      deadline,
      teacherId
    };
    const updated = [...homeworks, newHomework];
    setHomeworks(updated);
    saveToLocalStorage('homeworks', updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Классов</CardTitle>
            <Icon name="School" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Учеников</CardTitle>
            <Icon name="Users" className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Учителей</CardTitle>
            <Icon name="UserCheck" className="text-accent" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teachers.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Родителей</CardTitle>
            <Icon name="Heart" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{parents.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="classes">Классы</TabsTrigger>
          <TabsTrigger value="grades">Успеваемость</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="UserCheck" size={24} />
                  Учителя
                </CardTitle>
                <AddTeacherForm classes={classes} onAdd={addTeacher} />
              </div>
            </CardHeader>
            <CardContent>
              {teachers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="UserX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Нет учителей</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Логин</TableHead>
                      <TableHead>Пароль</TableHead>
                      <TableHead>Предметы</TableHead>
                      <TableHead>Классы</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map(teacher => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell><Badge variant="outline">{teacher.login}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{teacher.password}</Badge></TableCell>
                        <TableCell>{teacher.subjects.join(', ')}</TableCell>
                        <TableCell>
                          {teacher.classIds.map(cId => {
                            const cls = classes.find(c => c.id === cId);
                            return cls ? <Badge key={cId} variant="outline" className="mr-1">{cls.name}</Badge> : null;
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditTeacherForm teacher={teacher} classes={classes} onUpdate={updateTeacher} />
                            <Button variant="destructive" size="sm" onClick={() => deleteTeacher(teacher.id)}>
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={24} />
                  Ученики
                </CardTitle>
                <AddStudentForm classes={classes} onAdd={addStudent} />
              </div>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="UserX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Нет учеников</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Класс</TableHead>
                      <TableHead>Логин</TableHead>
                      <TableHead>Пароль</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => {
                      const cls = classes.find(c => c.id === student.classId);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell><Badge>{cls?.name}</Badge></TableCell>
                          <TableCell><Badge variant="outline">{student.login}</Badge></TableCell>
                          <TableCell><Badge variant="secondary">{student.password}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditStudentForm student={student} classes={classes} onUpdate={updateStudent} />
                              <Button variant="destructive" size="sm" onClick={() => deleteStudent(student.id)}>
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Heart" size={24} />
                  Родители
                </CardTitle>
                <AddParentForm students={students} onAdd={addParent} />
              </div>
            </CardHeader>
            <CardContent>
              {parents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="UserX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Нет родителей</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Дети</TableHead>
                      <TableHead>Логин</TableHead>
                      <TableHead>Пароль</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parents.map(parent => (
                      <TableRow key={parent.id}>
                        <TableCell className="font-medium">{parent.name}</TableCell>
                        <TableCell>
                          {parent.childrenIds.map(cId => {
                            const child = students.find(s => s.id === cId);
                            return child ? <Badge key={cId} variant="outline" className="mr-1">{child.name}</Badge> : null;
                          })}
                        </TableCell>
                        <TableCell><Badge variant="outline">{parent.login}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{parent.password}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditParentForm parent={parent} students={students} onUpdate={updateParent} />
                            <Button variant="destructive" size="sm" onClick={() => deleteParent(parent.id)}>
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="School" size={24} />
                Управление классами
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AddClassForm onAdd={addClass} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {classes.map((cls) => (
                  <Card key={cls.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{cls.name}</span>
                        <Badge variant="secondary">{cls.grade} класс</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Users" size={16} />
                        <span>{cls.students.length} учеников</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" size={24} />
                Успеваемость школы
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="UserX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет учеников</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => {
                    const studentClass = classes.find(c => c.id === student.classId);
                    const avgGrades = Object.values(student.grades).flat();
                    const avg = avgGrades.length > 0 
                      ? (avgGrades.reduce((a, b) => a + b, 0) / avgGrades.length).toFixed(1)
                      : 'Н/Д';
                    
                    return (
                      <Card key={student.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{studentClass?.name}</p>
                            </div>
                            <Badge variant={Number(avg) >= 4 ? 'default' : 'secondary'}>
                              Средний балл: {avg}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calendar" size={24} />
                Расписание занятий
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AddScheduleForm classes={classes} teachers={teachers} onAdd={addSchedule} />
              <AddHomeworkForm classes={classes} teachers={teachers} onAdd={addHomework} />
              
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon name="Clock" size={20} />
                  Текущее расписание
                </h3>
                {schedules.map((schedule) => {
                  const cls = classes.find(c => c.id === schedule.classId);
                  const teacher = teachers.find(t => t.id === schedule.teacherId);
                  return (
                    <Card key={schedule.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{schedule.subject}</p>
                            <p className="text-sm text-muted-foreground">{cls?.name}</p>
                            <p className="text-sm text-muted-foreground">{teacher?.name}</p>
                          </div>
                          <div className="text-right">
                            <Badge>{schedule.day}</Badge>
                            <p className="text-sm mt-1">{schedule.time}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AddClassForm = ({ onAdd }: { onAdd: (name: string, grade: number) => void }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('1');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (name && grade) {
      onAdd(name, Number(grade));
      setName('');
      setGrade('1');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить класс
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый класс</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Название класса</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="11А" />
          </div>
          <div>
            <Label>Параллель</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10,11].map(g => (
                  <SelectItem key={g} value={g.toString()}>{g} класс</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddStudentForm = ({ classes, onAdd }: { classes: Class[], onAdd: (name: string, classId: string, login: string, password: string) => void }) => {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (name && classId && login && password) {
      onAdd(name, classId, login, password);
      setName('');
      setClassId('');
      setLogin('');
      setPassword('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить ученика
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый ученик</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ФИО ученика</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иванов Иван Иванович" />
          </div>
          <div>
            <Label>Класс</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Логин</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="ivanov" />
          </div>
          <div>
            <Label>Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" />
          </div>
          <Button onClick={handleSubmit} className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditStudentForm = ({ student, classes, onUpdate }: { student: Student, classes: Class[], onUpdate: (id: string, data: Partial<Student>) => void }) => {
  const [name, setName] = useState(student.name);
  const [classId, setClassId] = useState(student.classId);
  const [login, setLogin] = useState(student.login);
  const [password, setPassword] = useState(student.password);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onUpdate(student.id, { name, classId, login, password });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="Edit" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать ученика</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ФИО</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Класс</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Логин</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} />
          </div>
          <div>
            <Label>Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddTeacherForm = ({ classes, onAdd }: { classes: Class[], onAdd: (name: string, subjects: string[], login: string, password: string, classIds: string[]) => void }) => {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (name && subjects && login && password) {
      onAdd(name, subjects.split(',').map(s => s.trim()), login, password, selectedClasses);
      setName('');
      setSubjects('');
      setLogin('');
      setPassword('');
      setSelectedClasses([]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить учителя
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый учитель</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ФИО учителя</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Петров Петр Петрович" />
          </div>
          <div>
            <Label>Предметы (через запятую)</Label>
            <Input value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="Математика, Физика" />
          </div>
          <div>
            <Label>Логин</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="petrov" />
          </div>
          <div>
            <Label>Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" />
          </div>
          <div>
            <Label>Назначить классы</Label>
            <div className="space-y-2 mt-2">
              {classes.map(cls => (
                <div key={cls.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClasses([...selectedClasses, cls.id]);
                      } else {
                        setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                      }
                    }}
                  />
                  <Label>{cls.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditTeacherForm = ({ teacher, classes, onUpdate }: { teacher: Teacher, classes: Class[], onUpdate: (id: string, data: Partial<Teacher>) => void }) => {
  const [name, setName] = useState(teacher.name);
  const [subjects, setSubjects] = useState(teacher.subjects.join(', '));
  const [login, setLogin] = useState(teacher.login);
  const [password, setPassword] = useState(teacher.password);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(teacher.classIds);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onUpdate(teacher.id, { 
      name, 
      subjects: subjects.split(',').map(s => s.trim()), 
      login, 
      password,
      classIds: selectedClasses
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="Edit" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать учителя</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ФИО</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Предметы (через запятую)</Label>
            <Input value={subjects} onChange={(e) => setSubjects(e.target.value)} />
          </div>
          <div>
            <Label>Логин</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} />
          </div>
          <div>
            <Label>Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <Label>Назначенные классы</Label>
            <div className="space-y-2 mt-2">
              {classes.map(cls => (
                <div key={cls.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClasses([...selectedClasses, cls.id]);
                      } else {
                        setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                      }
                    }}
                  />
                  <Label>{cls.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddParentForm = ({ students, onAdd }: { students: Student[], onAdd: (name: string, childrenIds: string[], login: string, password: string) => void }) => {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (name && login && password && selectedChildren.length > 0) {
      onAdd(name, selectedChildren, login, password);
      setName('');
      setLogin('');
      setPassword('');
      setSelectedChildren([]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить родителя
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый родитель</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ФИО родителя</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Сидорова Мария Петровна" />
          </div>
          <div>
            <Label>Логин</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="sidorova" />
          </div>
          <div>
            <Label>Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" />
          </div>
          <div>
            <Label>Выбрать детей</Label>
            <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
              {students.map(student => (
                <div key={student.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedChildren.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChildren([...selectedChildren, student.id]);
                      } else {
                        setSelectedChildren(selectedChildren.filter(id => id !== student.id));
                      }
                    }}
                  />
                  <Label>{student.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditParentForm = ({ parent, students, onUpdate }: { parent: Parent, students: Student[], onUpdate: (id: string, data: Partial<Parent>) => void }) => {
  const [name, setName] = useState(parent.name);
  const [login, setLogin] = useState(parent.login);
  const [password, setPassword] = useState(parent.password);
  const [selectedChildren, setSelectedChildren] = useState<string[]>(parent.childrenIds);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onUpdate(parent.id, { name, login, password, childrenIds: selectedChildren });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="Edit" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать родителя</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ФИО</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Логин</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} />
          </div>
          <div>
            <Label>Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <Label>Дети</Label>
            <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
              {students.map(student => (
                <div key={student.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedChildren.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChildren([...selectedChildren, student.id]);
                      } else {
                        setSelectedChildren(selectedChildren.filter(id => id !== student.id));
                      }
                    }}
                  />
                  <Label>{student.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddScheduleForm = ({ classes, teachers, onAdd }: { classes: Class[], teachers: Teacher[], onAdd: (classId: string, day: string, time: string, subject: string, teacherId: string) => void }) => {
  const [classId, setClassId] = useState('');
  const [day, setDay] = useState('Понедельник');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (classId && day && time && subject && teacherId) {
      onAdd(classId, day, time, subject, teacherId);
      setClassId('');
      setTime('');
      setSubject('');
      setTeacherId('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Icon name="CalendarPlus" size={18} className="mr-2" />
          Добавить урок в расписание
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый урок</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Класс</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>День недели</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'].map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Время</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <Label>Предмет</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Математика" />
          </div>
          <div>
            <Label>Учитель</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите учителя" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddHomeworkForm = ({ classes, teachers, onAdd }: { classes: Class[], teachers: Teacher[], onAdd: (classId: string, subject: string, description: string, deadline: string, teacherId: string) => void }) => {
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (classId && subject && description && deadline && teacherId) {
      onAdd(classId, subject, description, deadline, teacherId);
      setClassId('');
      setSubject('');
      setDescription('');
      setDeadline('');
      setTeacherId('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icon name="BookOpen" size={18} className="mr-2" />
          Назначить домашнее задание
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Домашнее задание</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Класс</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Предмет</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Математика" />
          </div>
          <div>
            <Label>Описание задания</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Решить задачи 1-10 на стр. 45" />
          </div>
          <div>
            <Label>Срок сдачи</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div>
            <Label>Учитель</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите учителя" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">Назначить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
