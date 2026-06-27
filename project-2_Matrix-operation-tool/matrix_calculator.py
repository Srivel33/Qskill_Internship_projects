import numpy as np

def matrix():
    try:
        R=int(input("Enter no.of Rows:"))
        C=int(input("Enter no.of Columns:"))

        if R<=0 and C<=0:
           print("\nEnter Valid numbers")
           return None

    except ValueError:
        print("\nInvalid input!, Enter only whole number.")
        return None
        
    matrix=[]
    for i in range(R):
        row=[]
        for j in range(C):
            while True:
                try:
                    value=int(input(f"Enter value for position [{i}][{j}]:"))
                    row.append(value)
                    break
                except ValueError:
                    print("Invalid input, Enter Valid Number")
        matrix.append(row)

    return np.array(matrix)

print("----- Matrix-A ------\n\nEnter the number of rows and columns for Matrix-A.")
matrix_a=matrix()
if matrix_a is None:
    exit()

print("\n----- Matrix-B ------\nEnter the number of rows and columns for Matrix-B.\n")
matrix_b=matrix()
if matrix_b is None:
    exit()

print("\nYour Matrix-A is:\n",matrix_a)
print("\nYour Matrix-B is:\n",matrix_b)


while True:
    print("\n----------- MATRIX TOOL ----------\n")
    print("1)Add\n2)Sub\n3)Multiply\n4)Transpose\n5)Determinant\n6)Exit")
    try:
        operation=(int(input("\nCHOOSE THE OPERATION:(1/2/3/4/5/6)=")))
    except ValueError:
        print("\nInvalid input!, Enter numbers Between 1-6")
        continue
    
    if operation==1:
        if matrix_a.shape== matrix_b.shape:
            matrix_add = matrix_a + matrix_b
            print("\nThe Addition of the two matrix is:\n",matrix_add)
        else:
            print("\nAddition failed!,Enter same matrix dimensions.")
    
    elif operation==2:
        if matrix_a.shape==matrix_b.shape:
            matrix_sub = matrix_a - matrix_b
            print("\nThe subtraction of the two matrix is:\n",matrix_sub)
        else:
            print("\nSubtraction Failed!,Enter same matrix dimensions.")
    
    elif operation==3:
        if matrix_a.shape[1]==matrix_b.shape[0]:
            matrix_mul = np.dot(matrix_a, matrix_b)
            print("\nThe multiplication of the two matrix is:\n",matrix_mul)
        else:
            print("\nMultiplication Failed!,Columns of Matrix A must equal rows of Matrix B")
    
    elif operation==4:
        transpose_a=matrix_a.transpose()
        transpose_b=matrix_b.transpose()
        print("\nThe transpose of the matrix-A is:\n",transpose_a)
        print("\nThe transpose of the matrix-B is:\n",transpose_b)
    
    elif operation==5:
        if matrix_a.shape[0]==matrix_a.shape[1]:
            determinant_a=np.linalg.det(matrix_a)
            print("\nThe Determinant of the matrix_a is:\n",determinant_a)
        else:
            print("\nMatrix A is not Square")
        if matrix_b.shape[0]==matrix_b.shape[1]:
            determinant_b=np.linalg.det(matrix_b)
            print("\nThe Determinant of the matrix_b is:\n",determinant_b)
        else:
            print("\nMatrix B is not Square")
    elif operation==6:
        print("\nExiting the program...")
        break
            
    else:
        print("\nInvalid option! Choose the operation between 1-6.")

    choice=input("\nDo you want to continue?(yes/no):")

    if choice.lower()=="no":
        print("\nExiting the program...")
        break
    elif choice.lower()=="yes":
        continue
    
