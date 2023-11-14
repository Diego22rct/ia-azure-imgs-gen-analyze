import React,{ useReducer } from 'react';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './OptionsComputerVision';

const initialState = {
  input: null,
  analysis: null,
  generatedImage: null,
  processing: false,
  cursor: null,
  promptEntered: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload };
    case 'SET_GENERATED_IMAGE':
      return { ...state, generatedImage: action.payload };
    case 'SET_PROCESSING':
      return { ...state, processing: action.payload };
    case 'SET_CURSOR':
      return { ...state, cursor: action.payload };
    case 'SET_PROMPT_ENTERED':
      return { ...state, promptEntered: action.payload };
    default:
      return state;
  }
};

function PrettyPrintJson(data) {
  return (<div><pre>{JSON.stringify(data, null, 2)}</pre></div>);
}

function DisplayResults({ generatedImage, analysis }) {
  if (generatedImage != null){
    return (
      <div>
        <h2>Image Generation</h2>
        <div><img src={generatedImage.URL} height="200" border="1" alt={generatedImage.prompt} /></div>
        {PrettyPrintJson(generatedImage)}
      </div>
    )
  }
  else{
    return (
      <div>
        <h2>Computer Vision Analysis</h2>
        <div><img src={analysis.URL} height="200" border="1" alt={(analysis.captionResult && analysis.captionResult.text ? analysis.captionResult.text : "can't find caption")} /></div>
        {PrettyPrintJson(analysis)}
      </div>
    )
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { input, analysis, generatedImage, processing, cursor, promptEntered } = state;

  const handleChange = (e) => {
    dispatch({ type: 'SET_INPUT', payload: e.target.value });
    dispatch({ type: 'SET_CURSOR', payload: e.target.selectionStart });
  };

  const onFileUrlEntered = (e) => {
    if (e.target.checkValidity()) {
      dispatch({ type: 'SET_PROCESSING', payload: true });
      dispatch({ type: 'SET_PROMPT_ENTERED', payload: false });
      dispatch({ type: 'SET_ANALYSIS', payload: null });

      computerVision(input || null).then((item) => {
        dispatch({ type: 'SET_ANALYSIS', payload: item });
        dispatch({ type: 'SET_INPUT', payload: "" });
        dispatch({ type: 'SET_PROCESSING', payload: false });
      });
    }
  };

  const onPromptEntered = (e) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_PROMPT_ENTERED', payload: true });
    dispatch({ type: 'SET_GENERATED_IMAGE', payload: null });

    // imageGeneration(input || null).then((item) => {
    //   dispatch({ type: 'SET_GENERATED_IMAGE', payload: item });
    //   dispatch({ type: 'SET_INPUT', payload: "" });
    //   dispatch({ type: 'SET_PROCESSING', payload: false });
    // });
  };

  const AnalyzeOrGenerate = () => {
    return (
      <div>
        <h1>Computer vision</h1>
        {!processing && (
          <div>
            <div>
              <label>Insert URL or type prompt: </label>
            </div>
            <div>
              <input autoFocus="autofocus" type="text" id="input" defaultValue={input} placeholder="Enter URL to analyze or textual prompt to generate an image" size="50" onChange={handleChange} onFocus={(e) => {e.target.selectionStart = cursor;}}></input>
            </div>
            <button onClick={onFileUrlEntered}>Analyze</button>
            &nbsp;
            <button onClick={onPromptEntered}>Generate</button>
          </div>
        )}
        {processing && <div>
          Loading...
          </div>}
        <hr />
        {!promptEntered && analysis && <DisplayResults generatedImage={generatedImage} analysis={analysis} />}
        {promptEntered && generatedImage && <DisplayResults generatedImage={generatedImage} analysis={analysis} />}
      </div>
    );
  };

  const CantAnalyze = () => {
    return <div>Key and/or endpoint not configured for cognitive services</div>;
  };

  function Render() {
    const cvReady = ComputerVisionIsConfigured();

    if (cvReady) {
      return <AnalyzeOrGenerate />;
    }
    return <CantAnalyze />;
  }

  return (
    <div>
      {Render()}
    </div>
  );
}

export default App;
