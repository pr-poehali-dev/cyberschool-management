import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const StudentDashboard = () => {
  const [myClass, setMyClass] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [grades, setGrades] = useState<any>({});

  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    const allHomeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');

    if (classes.length > 0) {
      setMyClass(classes[0]);
      const classSchedule = schedules.filter((s: any) => s.classId === classes[0].id);
      setSchedule(classSchedule);
      const classHomework = allHomeworks.filter((h: any) => h.classId === classes[0].id);
      setHomeworks(classHomework);
    }

    if (students.length > 0) {
      setGrades(students[0].grades || {});
    }
  }, []);

  const calculateAverage = () => {
    const allGrades = Object.values(grades).flat() as number[];
    if (allGrades.length === 0) return 'Н/Д';
    return (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Мой класс</CardTitle>
            <Icon name="School" className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myClass?.name || 'Н/Д'}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Средний балл</CardTitle>
            <Icon name="TrendingUp" className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{calculateAverage()}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Д/З на проверке</CardTitle>
            <Icon name="BookOpen" className="text-accent" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{homeworks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="homework">Д/З</TabsTrigger>
          <TabsTrigger value="grades">Оценки</TabsTrigger>
          <TabsTrigger value="class">Мой класс</TabsTrigger>
        </TabsList>

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
                  {schedule.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">{item.subject}</p>
                            <p className="text-sm text-muted-foreground">{item.teacher}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{item.day}</Badge>
                            <p className="text-sm mt-1">{item.time}</p>
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
                              <p className="font-medium">{hw.subject}</p>
                              <p className="text-sm text-muted-foreground">{hw.description}</p>
                            </div>
                            <Badge variant="secondary">До {hw.deadline}</Badge>
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

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" size={24} />
                Мои оценки
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(grades).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="FileX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет оценок</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(grades).map(([subject, marks]) => {
                    const avg = (marks as number[]).length > 0 
                      ? ((marks as number[]).reduce((a, b) => a + b, 0) / (marks as number[]).length).toFixed(1)
                      : 'Н/Д';
                    
                    return (
                      <Card key={subject}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{subject}</p>
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
                              <p className="text-sm text-muted-foreground">Средний балл</p>
                              <p className="text-2xl font-bold">{avg}</p>
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

        <TabsContent value="class">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Users" size={24} />
                Мой класс
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!myClass ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="UserX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Класс не назначен</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{myClass.name}</p>
                          <p className="text-muted-foreground">{myClass.grade} класс</p>
                        </div>
                        <Badge variant="outline" className="text-lg px-4 py-2">
                          {myClass.students.length} учеников
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 text-center">
                        <Icon name="Calendar" size={32} className="mx-auto mb-2 text-primary" />
                        <p className="font-medium">Уроков в неделю</p>
                        <p className="text-2xl font-bold">{schedule.length}</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 text-center">
                        <Icon name="BookOpen" size={32} className="mx-auto mb-2 text-secondary" />
                        <p className="font-medium">Активных заданий</p>
                        <p className="text-2xl font-bold">{homeworks.length}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
