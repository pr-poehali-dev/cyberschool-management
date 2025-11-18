import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import type { Teacher, Class, Student, Schedule, Homework } from '@/types';

interface Props {
  userId: string;
}

const TeacherDashboard = ({ userId }: Props) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = () => {
    const teachers: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]');
    const currentTeacher = teachers.find(t => t.id === userId);
    setTeacher(currentTeacher || null);

    const classes: Class[] = JSON.parse(localStorage.getItem('classes') || '[]');
    const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
    const allStudents: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
    const allHomeworks: Homework[] = JSON.parse(localStorage.getItem('homeworks') || '[]');

    if (currentTeacher) {
      const teacherClasses = classes.filter(c => currentTeacher.classIds.includes(c.id));
      setMyClasses(teacherClasses);

      const teacherSchedule = schedules.filter(s => s.teacherId === currentTeacher.id);
      setSchedule(teacherSchedule);

      const classIds = teacherClasses.map(c => c.id);
      const classStudents = allStudents.filter(s => classIds.includes(s.classId));
      setStudents(classStudents);

      const teacherHomework = allHomeworks.filter(h => h.teacherId === currentTeacher.id);
      setHomeworks(teacherHomework);
    }
  };

  const addGrade = (studentId: string, subject: string, grade: number) => {
    const allStudents: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
    const updated = allStudents.map(s => {
      if (s.id === studentId) {
        const grades = { ...s.grades };
        if (!grades[subject]) grades[subject] = [];
        grades[subject] = [...grades[subject], grade];
        return { ...s, grades };
      }
      return s;
    });
    localStorage.setItem('students', JSON.stringify(updated));
    loadData();
  };

  const addHomework = (classId: string, subject: string, description: string, deadline: string) => {
    if (!teacher) return;
    const newHomework: Homework = {
      id: Date.now().toString(),
      classId,
      subject,
      description,
      deadline,
      teacherId: teacher.id
    };
    const allHomeworks: Homework[] = JSON.parse(localStorage.getItem('homeworks') || '[]');
    const updated = [...allHomeworks, newHomework];
    localStorage.setItem('homeworks', JSON.stringify(updated));
    loadData();
  };

  if (!teacher) {
    return (
      <div className="text-center py-20">
        <Icon name="UserX" size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Данные учителя не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Моих классов</CardTitle>
            <Icon name="School" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myClasses.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Уроков на неделю</CardTitle>
            <Icon name="Calendar" className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{schedule.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Моих учеников</CardTitle>
            <Icon name="Users" className="text-accent" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Д/З назначено</CardTitle>
            <Icon name="BookOpen" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{homeworks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="classes">Мои классы</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="homework">Д/З</TabsTrigger>
          <TabsTrigger value="grades">Оценки</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="School" size={24} />
                Мои классы
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myClasses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет назначенных классов</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myClasses.map((cls) => {
                    const classStudents = students.filter(s => s.classId === cls.id);
                    return (
                      <Card key={cls.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-lg">{cls.name}</p>
                              <p className="text-sm text-muted-foreground">{cls.grade} класс</p>
                            </div>
                            <Badge>{classStudents.length} учеников</Badge>
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

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calendar" size={24} />
                Моё расписание
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedule.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="CalendarX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Расписание пока не назначено</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedule.map((item) => {
                    const cls = myClasses.find(c => c.id === item.classId);
                    return (
                      <Card key={item.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">{item.subject}</p>
                              <p className="text-sm text-muted-foreground">{cls?.name}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{item.day}</Badge>
                              <p className="text-sm mt-1">{item.time}</p>
                            </div>
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

        <TabsContent value="homework">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  Домашние задания
                </CardTitle>
                <AddHomeworkForm classes={myClasses} onAdd={addHomework} />
              </div>
            </CardHeader>
            <CardContent>
              {homeworks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="BookX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет домашних заданий</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {homeworks.map((hw) => {
                    const cls = myClasses.find(c => c.id === hw.classId);
                    return (
                      <Card key={hw.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{hw.subject}</Badge>
                                  <Badge variant="secondary">{cls?.name}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{hw.description}</p>
                              </div>
                              <Badge>До {hw.deadline}</Badge>
                            </div>
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

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" size={24} />
                Оценки учеников
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="UserX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет учеников</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => {
                    const avgGrades = Object.values(student.grades).flat() as number[];
                    const avg = avgGrades.length > 0 
                      ? (avgGrades.reduce((a, b) => a + b, 0) / avgGrades.length).toFixed(1)
                      : 'Н/Д';
                    const cls = myClasses.find(c => c.id === student.classId);
                    
                    return (
                      <Card key={student.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{cls?.name}</p>
                                </div>
                                <Badge variant={Number(avg) >= 4 ? 'default' : 'secondary'}>
                                  Средний: {avg}
                                </Badge>
                              </div>
                              
                              {Object.keys(student.grades).length > 0 && (
                                <div className="space-y-2 mt-3">
                                  {Object.entries(student.grades).map(([subject, marks]) => (
                                    <div key={subject} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                                      <span className="text-sm font-medium">{subject}</span>
                                      <div className="flex gap-1">
                                        {(marks as number[]).map((mark, idx) => (
                                          <Badge 
                                            key={idx}
                                            variant={mark >= 4 ? 'default' : 'secondary'}
                                            className="text-xs"
                                          >
                                            {mark}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="mt-3">
                                <AddGradeForm 
                                  student={student} 
                                  subjects={teacher.subjects} 
                                  onAdd={(subject, grade) => addGrade(student.id, subject, grade)} 
                                />
                              </div>
                            </div>
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
      </Tabs>
    </div>
  );
};

const AddGradeForm = ({ student, subjects, onAdd }: { student: Student, subjects: string[], onAdd: (subject: string, grade: number) => void }) => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('5');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (subject && grade) {
      onAdd(subject, Number(grade));
      setSubject('');
      setGrade('5');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full">
          <Icon name="Plus" size={16} className="mr-2" />
          Поставить оценку
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выставить оценку</DialogTitle>
          <p className="text-sm text-muted-foreground">{student.name}</p>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Предмет</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите предмет" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Оценка</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 (Отлично)</SelectItem>
                <SelectItem value="4">4 (Хорошо)</SelectItem>
                <SelectItem value="3">3 (Удовлетворительно)</SelectItem>
                <SelectItem value="2">2 (Неудовлетворительно)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">Выставить</Button>
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
        <Button>
          <Icon name="Plus" size={18} className="mr-2" />
          Назначить Д/З
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новое домашнее задание</DialogTitle>
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

export default TeacherDashboard;
