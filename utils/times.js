const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return false;
  }

  const durationMilliSeconds = endTime - startTime;
  const duration = new Date(durationMilliSeconds).toISOString().substr(11, 8);

  return duration;
}

module.exports = { calculateDuration };