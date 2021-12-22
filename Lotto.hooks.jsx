import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball'

function getWinNumbers() {
  console.log('getWinNumber')
  const candidate = Array(45).fill().map((v, i) => i + 1)
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0])
  }
  const bonusNumber = shuffle[shuffle.length - 1]
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c)
  return [...winNumbers, bonusNumber]
}

const Lotto = () => {
  const lottoNumbers = useMemo(() => getWinNumbers(), []) // 복잡한 함수의 return 값을 기억
  const [winNumbers, setWinNumbers] = useState(lottoNumbers)
  const [winBalls, setWinBalls] = useState([])
  const [bonus, setBonus] = useState(null)
  const [redo, setRedo] = useState(false)
  const timeouts = useRef([]) // 일반 값을 기억

  useEffect(() => {
    console.log('useEffect')
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => {
        setWinBalls((prevWinBalls) => {
          return [...prevWinBalls, winNumbers[i]]
        })
      }, (i + 1) * 1000)
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[6])
      setRedo(true)
    }, 7000)
    return () => {
      timeouts.current.forEach((v) => {
        clearTimeout(v)
      })
    }
  }, [timeouts.current]) // 빈 배열이면 componentDidMount와 같음
  // 배열에 요소가있으면 componenetDidMount와 componenetDidUpdate 둘다 수행

  const onClickRedo = useCallback(() => { //복잡한 함수를 기억
    console.log(winNumbers)
    setWinNumbers(getWinNumbers())
    setWinBalls([])
    setBonus(null)
    setRedo(false)
    timeouts.current = []
  }, [winNumbers]) // 배열이 바뀌었을때 재실행, 까먹는다, // 자식컴포넌트에 함수를 넘길때는 useCallback무조건 해야함

  return (
    <>
      <div>당첨숫자</div>          
      <div id="결과창">
        {winBalls.map((v) => <Ball key={v} number={v} />)}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} />}
      {redo && <button onClick={onClickRedo}>한번 더!</button>}
    </>
  )
}

export default Lotto;