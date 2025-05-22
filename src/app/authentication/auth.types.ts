export interface Login {
    document_id: number,
    password: string
}

export interface User {
    name: string,
    last_name: string,
    document_id: number,
    address: string,
    role: string,
    phone: number,
    cell_phone: number,
    birth_date: Date,
    gender:string,
    identification_type:string,
    email:string

}