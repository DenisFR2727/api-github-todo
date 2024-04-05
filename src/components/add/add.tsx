import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addIssues } from '../todo/todoSlice';

import { Data } from './addTypes';
import "./add.scss";

type API_KEY = string;
const api_Key: API_KEY = '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';

function AddTodo() {
  const  dispatch  = useDispatch()
  const [url, setUrl] = useState<string>('');
  const [issues, setIssues] = useState<Data>([]);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(addIssues(issues));
        setUrl("");
  };
  const changeHandleIssue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const url: string = e.target.value;
              setUrl(url);
  };
  const fetchIssues = useCallback(async () => {
    try {
      const repo = url.replace('https://github.com/', '');
      const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        headers: {
          'Authorization': `token ${api_Key}`
        }
      });
      if (response.status === 403) {
        alert('You have exceeded the limit of requests to GitHub API');
        return;
      };
      if(response.ok || response.status === 200){
        const data = await response.json();
   
        setIssues(data);
      }
      
    }catch(error){
      
      console.error('problem with the fetch', error);
    }
  },[url]);

  useEffect(() => {
    if (url) {
      fetchIssues();
    };
  }, [url,fetchIssues]);

  return (
        <form onSubmit={submitForm}>
          <div id="change-text" className="mb-3">
            <input type="text" 
                  className="form-control" 
                  id="exampleInputEmail1"
                  placeholder='Enter repo url'
                  value={url} 
                  onChange={changeHandleIssue} 
            />
          </div>
          <button type="submit" className="btn btn-primary">Load issues</button>
        </form>
  )
}
export default AddTodo;
