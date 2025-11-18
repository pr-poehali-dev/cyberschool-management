import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const TeacherDashboard = () => {
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);

  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const allHomeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');

    setMyClasses(classes.slice(0, 2));
    setSchedule(schedules);
    setStudents(allStudents);
    setHomeworks(allHomeworks);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {myClasses.map((cls) => (
                    <Card key={cls.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-lg">{cls.name}</p>
                            <p className="text-sm text-muted-foreground">{cls.grade} класс</p>
                          </div>
                          <Badge>{cls.students.length} учеников</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                  <Icon name="BookX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет домашних заданий</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {homeworks.map((hw) => (
                    <Card key={hw.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{hw.subject}</p>
                              <p className="text-sm text-muted-foreground mt-1">{hw.description}</p>
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
                    
                    return (
                      <Card key={student.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{student.name}</p>
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
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
