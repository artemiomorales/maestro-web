import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Editor from './components/Editor';
import { setScene, setSelectedSequence } from './redux/slices/editorSlice';
import sceneData from '../_example_project/scenes/scene.json';
import sequenceData from '../_example_project/sequences/sequence1.json';
import { Scene, Sequence } from './redux/types';

const App = () => {
  const dispatch = useDispatch();

  console.log('sceneData', sceneData);
  useEffect(() => {
    dispatch( setScene( sceneData as unknown as Scene ) );
    dispatch( setSelectedSequence( sequenceData as unknown as Sequence ) );
  }, [dispatch]);

  return (
    <div className="app">
      <Editor />
    </div>
  );
};

export default App;