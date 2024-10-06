import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Editor from './components/Editor';
import { setScene } from './redux/slices/editorSlice';
import sceneData from '../scene.json';

const App = () => {
  const dispatch = useDispatch();

  console.log('sceneData', sceneData);
  useEffect(() => {
    dispatch( setScene( sceneData ) );
  }, [dispatch]);

  return (
    <div className="app">
      <Editor />
    </div>
  );
};

export default App;