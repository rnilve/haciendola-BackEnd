export type ProductT = {
    id: number;
    title: string;
    handle: string;
    description?: string; 
    sku?: string;
    grams?: string; 
    stock?: number; 
    price: number;
    comparePrice: number; 
    barcode?: string;
    rowCount?:number;
}



export type PaginationT = {

        currentPage: number,
        pageSize: number,
        totalCount: number,
    
}


export type ProductPaginationT = {
    products:ProductT[],
    pagination:PaginationT
}