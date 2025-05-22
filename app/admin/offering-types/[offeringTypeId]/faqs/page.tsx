import React from 'react';


type OfferingTypeFaqsPageProps = {
    params: Promise<{
        offeringTypeId: string;
    }>
}

async function OfferingTypeFaqsPage(props : OfferingTypeFaqsPageProps) {

    const params = await props.params;
    const offeringTypeId = params.offeringTypeId;

    return (
        <div>

        </div>
    );
}

export default OfferingTypeFaqsPage;