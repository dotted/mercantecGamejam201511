type coordinates = [number, number];

export function coordinatesFromGrid(size: number, row: number, tile: number) {
  //console.log('size', size, 'row', row, 'tile', tile)
  const result = [size * row, size * tile]
  return result
}