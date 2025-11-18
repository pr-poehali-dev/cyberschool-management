export interface Class {
  id: string;
  name: string;
  grade: number;
  students: string[];
  teacherId?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  grades: { [subject: string]: number[] };
  login: string;
  password: string;
  parentId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  classIds: string[];
  login: string;
  password: string;
}

export interface Parent {
  id: string;
  name: string;
  childrenIds: string[];
  login: string;
  password: string;
}

export interface Schedule {
  id: string;
  classId: string;
  day: string;
  time: string;
  subject: string;
  teacherId: string;
}

export interface Homework {
  id: string;
  classId: string;
  subject: string;
  description: string;
  deadline: string;
  teacherId: string;
}

export interface User {
  login: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  name: string;
  id: string;
}
