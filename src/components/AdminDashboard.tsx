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

interface Class {
  id: string;
  name: string;
  grade: number;
  students: string[];
}

interface Student {
  id: string;
  name: string;
  classId: string;
  grades: { [subject: string]: number[] };
}

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
}

interface Schedule {
  id: string;
  classId: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
}

interface Homework {
  id: string;
  classId: string;
  subject: string;
  description: string;
  deadline: string;
}

const AdminDashboard = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    const savedClasses = localStorage.getItem('classes');
    const savedStudents = localStorage.getItem('students');
    const savedTeachers = localStorage.getItem('teachers');
    const savedSchedules = localStorage.getItem('schedules');
    const savedHomeworks = localStorage.getItem('homeworks');

    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedSchedules) setSchedules(JSON.parse(savedSchedules));
    if (savedHomeworks) setHomeworks(JSON.parse(savedHomeworks));
  }, []);

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

  const addStudent = (name: string, classId: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      classId,
      grades: {}
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

  const addTeacher = (name: string, subjects: string[]) => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name,
      subjects
    };
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    saveToLocalStorage('teachers', updated);
  };

  const addSchedule = (classId: string, day: string, time: string, subject: string, teacher: string) => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      classId,
      day,
      time,
      subject,
      teacher
    };
    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    saveToLocalStorage('schedules', updated);
  };

  const addHomework = (classId: string, subject: string, description: string, deadline: string) => {
    const newHomework: Homework = {
      id: Date.now().toString(),
      classId,
      subject,
      description,
      deadline
    };
    const updated = [...homeworks, newHomework];
    setHomeworks(updated);
    saveToLocalStorage('homeworks', updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Всего классов</CardTitle>
            <Icon name="School" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Всего учеников</CardTitle>
            <Icon name="Users" className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Всего учителей</CardTitle>
            <Icon name="UserCheck" className="text-accent" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teachers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
          <TabsTrigger value="classes">Классы</TabsTrigger>
          <TabsTrigger value="grades">Успеваемость</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
        </TabsList>

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
              <AddStudentForm classes={classes} onAdd={addStudent} />
              <AddTeacherForm onAdd={addTeacher} />
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
              <AddHomeworkForm classes={classes} onAdd={addHomework} />
              
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon name="Clock" size={20} />
                  Текущее расписание
                </h3>
                {schedules.map((schedule) => {
                  const cls = classes.find(c => c.id === schedule.classId);
                  return (
                    <Card key={schedule.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{schedule.subject}</p>
                            <p className="text-sm text-muted-foreground">{cls?.name}</p>
                            <p className="text-sm text-muted-foreground">{schedule.teacher}</p>
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

const AddStudentForm = ({ classes, onAdd }: { classes: Class[], onAdd: (name: string, classId: string) => void }) => {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (name && classId) {
      onAdd(name, classId);
      setName('');
      setClassId('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
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
          <Button onClick={handleSubmit} className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddTeacherForm = ({ onAdd }: { onAdd: (name: string, subjects: string[]) => void }) => {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (name && subjects) {
      onAdd(name, subjects.split(',').map(s => s.trim()));
      setName('');
      setSubjects('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
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
          <Button onClick={handleSubmit} className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddScheduleForm = ({ classes, teachers, onAdd }: { classes: Class[], teachers: Teacher[], onAdd: (classId: string, day: string, time: string, subject: string, teacher: string) => void }) => {
  const [classId, setClassId] = useState('');
  const [day, setDay] = useState('Понедельник');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (classId && day && time && subject && teacher) {
      onAdd(classId, day, time, subject, teacher);
      setClassId('');
      setTime('');
      setSubject('');
      setTeacher('');
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
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите учителя" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
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

const AddHomeworkForm = ({ classes, onAdd }: { classes: Class[], onAdd: (classId: string, subject: string, description: string, deadline: string) => void }) => {
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (classId && subject && description && deadline) {
      onAdd(classId, subject, description, deadline);
      setClassId('');
      setSubject('');
      setDescription('');
      setDeadline('');
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
          <Button onClick={handleSubmit} className="w-full">Назначить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
