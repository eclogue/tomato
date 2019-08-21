import React, { useState } from 'react'
import Card from './card'
import update from 'immutability-helper'
const style = {
  width: 400,
}
const Container = ({books, onMove}) => {
  {
    const [cards, setCards] = useState(books)
    const moveCard = (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex]
      onMove(dragCard, dragIndex, hoverIndex)
      setCards(
        update(cards, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }),
      )
    }
    return (
      <div style={style}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
        ))}
      </div>
    )
  }
}
export default Container
