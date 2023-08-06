import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Web3 from 'web3';

const MAX_USAGE_TIMES = 10;

function Calculator() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [operator, setOperator] = useState('+');
  const [result, setResult] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  useEffect(() => {
    checkMetamaskConnection();
    const count = localStorage.getItem('calculatorUsageCount');
    if (count) {
      setUsageCount(parseInt(count, 10));
    }
  }, []);

  const checkMetamaskConnection = useCallback(() => {
    setIsMetamaskConnected(typeof window.ethereum !== 'undefined');
  }, []);

  const handleNumber1Change = useCallback((e) => {
    setNumber1(e.target.value);
  }, []);

  const handleNumber2Change = useCallback((e) => {
    setNumber2(e.target.value);
  }, []);

  const handleOperatorChange = useCallback((e) => {
    setOperator(e.target.value);
  }, []);

  const calculate = useCallback(() => {
    const parsedNum1 = parseFloat(number1);
    const parsedNum2 = parseFloat(number2);

    if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
      setResult('Ошибка');
    } else {
      let calculatedResult;
      switch (operator) {
        case '+':
          calculatedResult = parsedNum1 + parsedNum2;
          break;
        case '-':
          calculatedResult = parsedNum1 - parsedNum2;
          break;
        case '*':
          calculatedResult = parsedNum1 * parsedNum2;
          break;
        case '/':
          if (parsedNum2 === 0) {
            calculatedResult = 'Ошибка: деление на ноль';
          } else {
            calculatedResult = parsedNum1 / parsedNum2;
          }
          break;
        default:
          calculatedResult = '';
          break;
      }

      setResult(calculatedResult.toString());
    }
  }, [number1, number2, operator]);

  const handleMoreClick = useCallback(() => {
    setIsDropdownVisible((prevState) => !prevState);
  }, []);

  const handleCalculate = useCallback(() => {
    calculate();
    setUsageCount((prevCount) => prevCount + 1);
    localStorage.setItem('calculatorUsageCount', (usageCount + 1).toString());
  }, [calculate, usageCount]);

  return (
    <div className="calculator">
      <input type="number" placeholder='number a' value={number1} onChange={handleNumber1Change} />
      <div className="operators">
        <div className='more'>
          <button value="+" onClick={handleOperatorChange}>+</button>
          <button className='btn_down' onClick={handleMoreClick}> ↓</button>
        </div>
        {isDropdownVisible && (
          <div className='dropdown'>
            <button value="-" onClick={handleOperatorChange}>-</button>
            <button value="*" onClick={handleOperatorChange}>*</button>
            <button value="/" onClick={handleOperatorChange}>/</button>
          </div>
        )}
      </div>
      <input type="number" placeholder='number b' value={number2} onChange={handleNumber2Change} />
      <input className='result' type="text" placeholder='Result' value={result} readOnly />
      <div className="keypad">
        <button className='calculate' onClick={handleCalculate}>Calculate</button>
      </div>
      <div className='used'>
        Calculator used: {usageCount} times
      </div>
    </div>
  );
}

export default Calculator;
