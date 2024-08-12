
export {
readingAxis,
movementDirection,
exercises,
trialStatus
}

const readingAxis = {
    None: 'None',
    XAxis: 'XAxis',
    YAxis: 'YAxis',
    ZAxis: 'ZAxis'
  };
  
  const movementDirection = {
    None: 'None',
    BottomToCenter: 'BottomToCenter',
    BackToCenter: 'BackToCenter',
    LeftToCenter: 'LeftToCenter',
    RightToCenter: 'RightToCenter'
  };
  
  const exercises = {
    None: 'None',
    Extension: 'Extension',
    Flexion: 'Flexion',
    LeftLateralFlexion: 'LeftLateralFlexion',
    RightLateralFlexion: 'RightLateralFlexion',
    LeftRotation: 'LeftRotation',
    RightRotation: 'RightRotation',
    DiagonalFlexionRightDownToCenter: 'DiagonalFlexionRightDownToCenter',
    DiagonalFlexionRightBackToCenter: 'DiagonalFlexionRightBackToCenter',
    DiagonalFlexionLeftDownToCenter: 'DiagonalFlexionLeftDownToCenter',
    DiagonalFlexionLeftBackToCenter: 'DiagonalFlexionLeftBackToCenter'
  };
  
  const trialStatus = {
    None: 'None',
    Created: 'Created',
    InProgress: 'InProgress',
    Completed: 'Completed'
  };
  
 
  