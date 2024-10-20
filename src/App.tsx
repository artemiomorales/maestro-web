import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from './components/Editor';
import { setScene, setSelectedSequence } from './redux/slices/editorSlice';
import { RootState, Scene, Sequence } from './redux/types';
import { useLocation } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();
  const [postId, setPostId] = useState(null);
  const location = useLocation();
  const nonce = (window as Window).MaestroWebData?.nonce;

  const {
    scene,
    selectedSequence,
  } = useSelector( (state: RootState) => {
    return state.editor;
  });

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
          setPostId(data.id);

          dispatch( setScene( JSON.parse(data.meta.scenes) as unknown as Scene ) );
          dispatch( setSelectedSequence( JSON.parse(data.meta.sequences) as unknown as Sequence ) );
        })
        .catch(error => console.error('Error fetching post:', error));
    }

  }, [dispatch, location.search, nonce, postId]);

  return (
    <div className="app">
      <button onClick={() => {
        const jsonData = {
          meta: {
            scenes: JSON.stringify(scene), // Convert JSON to string
            sequences: JSON.stringify(selectedSequence)
          }
        };

        fetch(`/wp-json/wp/v2/scrollies/${postId}`, {
          method: 'POST', // Use POST or PUT depending on your needs
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce, // Include the nonce for authentication
          },
          body: JSON.stringify(jsonData),
        })
          .then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch(error => console.error('Error:', error));
      }}>Save Data</button>
      <Editor />
    </div>
  );
};

export default App;