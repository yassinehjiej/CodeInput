import { useEffect, useRef, useState, useCallback } from "react";
import Input from "../Input";

interface CodeInputProps {
  length: number;
  onCodeFull: (code: string) => void;
}

interface ChangeParams {
  event: React.ChangeEvent<HTMLInputElement>;
  index: number;
}

interface KeyDownParams {
  index: number;
  event: any;
}

const backspaceButton = 'Backspace'; //should be in a separate file

/**
 * Generate a table of code based on length
 * 
 * @param length
 * @returns
 */
function generateCodeTable(length: number) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push([`field${i}`, null]);
  }

  return arr;
}


/**
 * Check if the input is a number 
 * 
 * @param value 
 * @returns 
 */
function isValidInput(value: string) {
  return !isNaN(+value) && value.length;
}

/**
 * This function allows us to personalize the number of OTP code input
 * 
 * @param length
 * @param onCodeFull
 * @returns 
 */
export default function CodeInput({ length, onCodeFull }: CodeInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [nextInputIndex, setNextInputIndex] = useState(0);
  const [code, setCode]: any = useState(Object.fromEntries(generateCodeTable(length)));
  const handleChange = ({ event, index }: ChangeParams) => {
    const { name, value } = event.target;
    let postValue: any = null;
    if (isValidInput(value)) {
      postValue = +value;
    }

    setCode((prevState: any) => ({
      ...prevState,
      [name]: postValue,
    }));


    if (isValidInput(value)) {
      const lastInputIndex = length - 1;
      let newInputIndex = index === lastInputIndex ? lastInputIndex : index + 1;
      setNextInputIndex(newInputIndex);
    }

  };

  const handleKeyDown = ({ index, event }: KeyDownParams) => {
    if (event.code === backspaceButton) {
      const { value } = event.target;
      let newInputIndex = index;
      if (!value.length) {
        newInputIndex = index === 0 ? 0 : index - 1;
      }

      setNextInputIndex(newInputIndex);
    }
  };

  useEffect(() => {
    if (input.current) input.current.focus();
  }, [nextInputIndex]);

  const handleValidation = useCallback(() => {
    const values = Object.values(code);
    if (!values.includes(null)) {
      onCodeFull(values.join(""));
    }
  }, [onCodeFull, code]);
  useEffect(() => {
    handleValidation();
  }, [handleValidation]);



  return (
    <div>
      {Object.keys(code).map((key, index) => {
        return (
          <Input
            data-testid="input"
            name={key}
            value={code[key] === null ? "" : code[key]}
            maxLength={1}
            key={key}
            onKeyDown={(event) => {
              const params = { index, event } as unknown as KeyDownParams;
              handleKeyDown(params);
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const params = { event, index } as unknown as ChangeParams;
              handleChange(params);
            }}
            ref={nextInputIndex === index ? input : null}
          />
        );
      })}
    </div>
  );
}
