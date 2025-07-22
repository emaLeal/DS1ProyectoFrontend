export interface Postulacion {
    applicant_document: string,
    job_offer_id: number,
    undergraduate_title: string,
    postgraduate_title: string,
    motivation: string,
    resume: string,
    phone: string,
    application_date: string,
    resume_support?: File | null,
    resume_filename: string,
    undergraduate_support?: File | null,
    undergraduate_filename: string,
    postgraduate_support?: File | null,
    postgraduate_filename: string
}