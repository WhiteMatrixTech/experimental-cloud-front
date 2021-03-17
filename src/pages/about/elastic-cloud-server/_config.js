export const serverPurpose = {
  Ca: 'Ca',
  Peer: 'Peer',
  Orderer: 'Orderer',
  SwarmManager: 'SwarmManager',
  // Unknown: 'Unknown',
};

export const transCiphertext = (text) => {
  let len = text.length;
  let ciphertext = '';
  for (let i = 0; i < len; i++) {
    ciphertext += '*';
  }
  return ciphertext;
};
