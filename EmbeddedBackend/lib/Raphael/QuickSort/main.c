#include <stdio.h>

void swap(int *valueA, int *valueB) {
    int temp = *valueA;
    *valueA = *valueB;
    *valueB = temp;
}

void quickSort(int *arr, int left, int right){  
    if(left >= right) return;
    
    int l = left+1;
    int r = right;
    int key = arr[left];
    
    while(1) {
        while(l <= right){
            if(arr[l] > key) break;
            l++;
        }

        while(r > left){
            if(arr[r] < key) break;
            r--;
        }

        if(l > r) break;

        swap(&arr[l], &arr[r]); 
    }

    swap(&arr[left], &arr[r]);
    
    quickSort(arr, left, r-1);
    
    quickSort(arr, r+1, right);
}

int main(void){
    int array[10]={1,5,7,8,3,5,9,4,1,0};

    quickSort(array, 0, 9);

    for(int i = 0; i < 10; i++){
        printf("%d ",array[i]);
    }
}