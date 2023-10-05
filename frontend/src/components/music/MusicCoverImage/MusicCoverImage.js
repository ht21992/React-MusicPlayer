import React from 'react'

const MusicCoverImage = ({imageLink,imageId}) => {
  return (
    <img
        src={imageLink}
        className="active"
        id={'_' + imageId}
        
        />
  )
}

export default MusicCoverImage
