from typing import List, Tuple

def read_graph(filename: str) -> Tuple[List[List[int]], int]:
    adj_list = []
    f = open(filename, "r")
    first_line = f.readline().strip()
    if not first_line:
        return [], 0
    num_vertices = int(first_line)
    for line in f:
        if line.strip():
            parts = line.split()
            row = []
            for i in range(1, len(parts)):
                row.append(int(parts[i]))
            adj_list.append(row)
    f.close()
    return adj_list, num_vertices

def write_neighbours_list(adj_list: List[List[int]]) -> None:
    for i in range(len(adj_list)):
        sasiad_str = ""
        for j in range(len(adj_list[i])):
            sasiad_str += str(adj_list[i][j])
            if j < len(adj_list[i]) - 1:
                sasiad_str += ", "
        print("Sąsiadami wierzchołka " + str(i) + " są: " + sasiad_str)

def list_to_matrix(adj_list: List[List[int]], num_vertices: int) -> List[List[int]]:
    matrix = []
    for i in range(num_vertices):
        matrix.append([0] * num_vertices)
    for i in range(len(adj_list)):
        for sasiad in adj_list[i]:
            matrix[i][sasiad] = 1
    return matrix

def write_matrix(matrix: List[List[int]]) -> None:
    for row in matrix:
        linia = ""
        for element in row:
            linia += str(element) + " "
        print(linia.strip())

def main() -> None:
    nazwa_pliku = "graph.txt"
    lista, n = read_graph(nazwa_pliku)
    if n > 0:
        write_neighbours_list(lista)
        print()
        macierz = list_to_matrix(lista, n)
        write_matrix(macierz)

if __name__ == "__main__":
    main()