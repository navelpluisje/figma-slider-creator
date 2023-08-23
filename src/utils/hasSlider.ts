type Action = 'cap' | 'cap-range' | 'track' | 'progress' | 'progress-center';

const hasCap = (name: string): boolean => {
  return /^cap/i.test(name)
}

export const getAction = (name): Action | null => {
  const action = /^(cap\-range|cap|track|progress\-center|progress)/i.exec(name);
  return action ? action[0].toLocaleLowerCase() as Action : null;
}

export const hasCapNodes = (nodes: readonly SceneNode[]) => (
  nodes.find(node => hasCap(node.name))
);
