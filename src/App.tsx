import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Editor from './components/Editor';
import { setScene, setSelectedSequence } from './redux/slices/editorSlice';
import sceneData from '../_example_project/scenes/scene.json';
import sequenceData from '../_example_project/sequences/sequence1.json';
import { Scene, Sequence } from './redux/types';
import { useLocation } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const location = useLocation();
  const nonce = (window as Window).MaestroWebData?.nonce;

  console.log('sceneData', sceneData);
  useEffect(() => {

    // Extract the 'post' parameter from the URL
    const searchParams = new URLSearchParams(location.search);
    const postId = searchParams.get('post');

    if (postId) {
      // Fetch the post data from the WordPress REST API
      fetch(`/wp-json/wp/v2/scrollies/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('post', data);
          setPost(data);
        })
        .catch(error => console.error('Error fetching post:', error));
    }

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