import React, { Component } from 'react';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import createHighlightPlugin from './highlightPlugin';

const emojiPlugin = createEmojiPlugin();
const highlightPlugin = createHighlightPlugin({background: 'yellow', color: 'black'});

const { EmojiSuggestions } = emojiPlugin;

class App extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({ editorState });

  };

  saveContent = (content) => {
    window.localStorage.setItem('content', JSON.stringify(convertToRaw(content)));
  }

  onUnderlineClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  onToggleCode = () => {
    this.onChange(RichUtils.toggleCode(this.state.editorState));
  }

  render() {
    return (
      <div>
        <button onClick={this.onUnderlineClick}>Underline</button>
        <button onClick={this.onToggleCode}>Code Block</button>
        <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
          handleKeyCommand={this.handleKeyCommand}
          plugins={ [highlightPlugin, emojiPlugin] }
        />
        <EmojiSuggestions />
      </div>
    );
  }
}

export default App;
