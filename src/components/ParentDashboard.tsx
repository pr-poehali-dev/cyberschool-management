import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const ParentDashboard = () => {
  const [child, setChild] = useState<any>(null);
  const [childClass, setChildClass] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    const allHomeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');

    if (students.length > 0) {
      const studentData = students[0];
      setChild(studentData);
      
      const cls = classes.find((c: any) => c.id === studentData.classId);
      setChildClass(cls);

      if (cls) {
        const classSchedule = schedules.filter((s: any) => s.classId === cls.id);
        setSchedule(classSchedule);
        const classHomework = allHomeworks.filter((h: any) => h.classId === cls.id);
        setHomeworks(classHomework);
      }
    }
  }, []);

  const calculateAverage = () => {
    if (!child || !child.grades) return 'Н/Д';
    const allGrades = Object.values(child.grades).flat() as number[];
    if (allGrades.length === 0) return 'Н/Д';
    return (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ребёнок</CardTitle>
            <Icon name="UserCircle" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{child?.name || 'Н/Д'}</div>
            <p className="text-sm text-muted-foreground">{childClass?.name}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Успеваемость</CardTitle>
            <Icon name="TrendingUp" className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{calculateAverage()}</div>
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
              {!child || !child.grades || Object.keys(child.grades).length === 0 ? (
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
                          <p className="text-3xl font-bold">{calculateAverage()}</p>
                        </div>
                        <Badge 
                          variant={Number(calculateAverage()) >= 4 ? 'default' : 'secondary'}
                          className="text-lg px-4 py-2"
                        >
                          {Number(calculateAverage()) >= 4 ? 'Отлично' : 'Хорошо'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {Object.entries(child.grades).map(([subject, marks]) => {
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
                                <p className="text-xs text-muted-foreground">{item.teacher}</p>
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
