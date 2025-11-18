import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Parent, Student, Class, Schedule, Homework } from '@/types';

interface Props {
  userId: string;
}

const ParentDashboard = ({ userId }: Props) => {
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [childClass, setChildClass] = useState<Class | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    const parents: Parent[] = JSON.parse(localStorage.getItem('parents') || '[]');
    const currentParent = parents.find(p => p.id === userId);
    setParent(currentParent || null);

    if (currentParent) {
      const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
      const parentChildren = students.filter(s => currentParent.childrenIds.includes(s.id));
      setChildren(parentChildren);

      if (parentChildren.length > 0) {
        setSelectedChildId(parentChildren[0].id);
        loadChildData(parentChildren[0].id, students);
      }
    }
  }, [userId]);

  const loadChildData = (childId: string, allStudents?: Student[]) => {
    const students: Student[] = allStudents || JSON.parse(localStorage.getItem('students') || '[]');
    const child = students.find(s => s.id === childId);

    if (child) {
      const classes: Class[] = JSON.parse(localStorage.getItem('classes') || '[]');
      const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
      const allHomeworks: Homework[] = JSON.parse(localStorage.getItem('homeworks') || '[]');

      const cls = classes.find(c => c.id === child.classId);
      setChildClass(cls || null);

      if (cls) {
        const classSchedule = schedules.filter(s => s.classId === cls.id);
        setSchedule(classSchedule);
        const classHomework = allHomeworks.filter(h => h.classId === cls.id);
        setHomeworks(classHomework);
      }
    }
  };

  const handleChildChange = (childId: string) => {
    setSelectedChildId(childId);
    loadChildData(childId);
  };

  const calculateAverage = (child: Student) => {
    if (!child || !child.grades) return 'Н/Д';
    const allGrades = Object.values(child.grades).flat() as number[];
    if (allGrades.length === 0) return 'Н/Д';
    return (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1);
  };

  if (!parent || children.length === 0) {
    return (
      <div className="text-center py-20">
        <Icon name="UserX" size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Данные не найдены</p>
      </div>
    );
  }

  const currentChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="space-y-6 animate-fade-in">
      {children.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Icon name="Users" size={24} className="text-primary" />
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Выберите ребёнка</label>
                <Select value={selectedChildId} onValueChange={handleChildChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map(child => (
                      <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ребёнок</CardTitle>
            <Icon name="UserCircle" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{currentChild?.name || 'Н/Д'}</div>
            <p className="text-sm text-muted-foreground">{childClass?.name}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Успеваемость</CardTitle>
            <Icon name="TrendingUp" className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentChild ? calculateAverage(currentChild) : 'Н/Д'}</div>
            <p className="text-sm text-muted-foreground">Средний балл</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Домашних заданий</CardTitle>
            <Icon name="BookOpen" className="text-accent" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{homeworks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Успеваемость</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="homework">Д/З</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" size={24} />
                Успеваемость ребёнка
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentChild || !currentChild.grades || Object.keys(currentChild.grades).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="FileX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет оценок</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Общая успеваемость</p>
                          <p className="text-3xl font-bold">{calculateAverage(currentChild)}</p>
                        </div>
                        <Badge 
                          variant={Number(calculateAverage(currentChild)) >= 4 ? 'default' : 'secondary'}
                          className="text-lg px-4 py-2"
                        >
                          {Number(calculateAverage(currentChild)) >= 4 ? 'Отлично' : 'Хорошо'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {Object.entries(currentChild.grades).map(([subject, marks]) => {
                      const avg = (marks as number[]).length > 0 
                        ? ((marks as number[]).reduce((a, b) => a + b, 0) / (marks as number[]).length).toFixed(1)
                        : 'Н/Д';
                      
                      return (
                        <Card key={subject}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-lg">{subject}</p>
                                <div className="flex gap-2 mt-2">
                                  {(marks as number[]).map((mark, idx) => (
                                    <Badge 
                                      key={idx}
                                      variant={mark >= 4 ? 'default' : 'secondary'}
                                    >
                                      {mark}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Средний</p>
                                <p className="text-2xl font-bold">{avg}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
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
                Расписание ребёнка
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
                  {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'].map(day => {
                    const daySchedule = schedule.filter(s => s.day === day);
                    if (daySchedule.length === 0) return null;
                    
                    return (
                      <Card key={day}>
                        <CardHeader>
                          <CardTitle className="text-base">{day}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {daySchedule.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                              <div>
                                <p className="font-medium text-sm">{item.subject}</p>
                              </div>
                              <Badge variant="outline">{item.time}</Badge>
                            </div>
                          ))}
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
              <CardTitle className="flex items-center gap-2">
                <Icon name="BookOpen" size={24} />
                Домашние задания
              </CardTitle>
            </CardHeader>
            <CardContent>
              {homeworks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="BookCheck" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Нет активных заданий</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {homeworks.map((hw) => (
                    <Card key={hw.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{hw.subject}</Badge>
                              </div>
                              <p className="text-sm mt-2">{hw.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Срок сдачи</p>
                              <Badge variant="secondary">{hw.deadline}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
