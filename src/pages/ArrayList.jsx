function ArrayList() {

  const [arrayListSize, setArrayListSize] = useState(1);

  const incrementSize = () => {
    if (arrayListSize < 20) {
      setArrayListSize(arrayListSize + 1);
    }
    else {
      console.log("Array List is too big to render!!");
    }
  }

  const decrementSize = () => {
    if (arrayListSize > 1) {
      setArrayListSize(arrayListSize - 1);
    }
    else {
      console.log("Array List must have a nonnegative length!")
    }
  }

  return (
    <div>
      <button onClick={incrementSize}>Increment Array Length</button>
      <button onClick={decrementSize}>Decrement Array Length</button><br></br><br></br>
      <p>Array List Length: {arrayListSize}</p>
    </div>
  );
}

export default ArrayList