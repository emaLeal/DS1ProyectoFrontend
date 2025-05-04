export interface Login {
    document_id: number,
    password: string
}

export interface UserForm {
    name: string,
    last_name: string,
    document_id: number,
    address: string,
    role_id?: number,
    phone: number
}