import { Dispatch, SetStateAction, useState } from 'react';
import supabase from '../supabase';
import Fact from './../interface/Fact';

import Facts from './facts.model';

// TODO: interface divided
interface NewFactFormProps {
  setFacts: (facts: (facts: []) => void) => void;
  setShowForm: (showForm: boolean) => void;
  categories: Categories[];
}

interface Categories {
  name: string;
  color: string;
}

const NewFactForm: React.FC<NewFactFormProps> = ({
  setFacts,
  setShowForm,
  categories,
}) => {
  const [text, setText] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [category, setCategory] = useState<string>(); //! need to be reviewd
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const textLength = text.length;

  async function handleSubmit(e: React.FormEvent) {
    // 1) prevent browser reload
    e.preventDefault();

    // 2) Check if the data is valid. If so, create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //3) upload fact to supabase and receive and receive new fact object.

      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();

      // 4) Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      setIsUploading(false);

      // 5) Reset input fields
      setText('');
      setSource('');
      setCategory('');

      // 6) Close the form
      setShowForm(false);
    }
  }

  function isValidHttpUrl(string: string = '') {
    let url: URL;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  return (
    <form className='fact-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Share a fact with the world...'
        value={text}
        disabled={isUploading}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type='text'
        placeholder='Trustworthy source...'
        value={source}
        disabled={isUploading}
        onChange={(e) => setSource(e.target.value)}
      />

      {/* //TODO: <HTMLSelectElement> search how to declare SelectInputs */}
      <select
        value={category}
        disabled={isUploading}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value=''>Choose category:</option>
        {categories.map((category) => (
          <option key={crypto.randomUUID()} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className='btn btn-large' disabled={isUploading}>
        {isUploading ? 'Sending...' : 'Post'}
      </button>
    </form>
  );
};
export default NewFactForm;
