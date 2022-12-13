import React, { useEffect } from 'react';
import axios from 'axios';
import TodoMain from './components/TodoMain';
import TodoState from '../../store/mobx/TodoState';
import UserState from '../../store/mobx/UserState';

type resType = {data : { id: string, topic: string, description: string,
  status: string, deadline: string, files: { name: string, url: string }[]}[]}

const ToDoPage = () => {
  useEffect(() => {
    const localLogin = localStorage.getItem('login');
    const localToken = localStorage.getItem('token');
    if (UserState.login === '' || UserState.token === '') {
      UserState.signIn({ token: localToken as string, login: localLogin as string });
    }
    if (localLogin !== 'undefined' && localLogin !== null) {
      axios(`http://localhost:3001/data?username=${localLogin}@test.ru`)
        .then((res : resType) => {
          TodoState.newItemsByArr(res.data);
        });
    }
  }, [null]);

  return (
    <div className="todolist-conteiner">
      <TodoMain />
    </div>
  );
};

export default ToDoPage;
