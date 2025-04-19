import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 }); // cache for 5 minutes

export default cache;
