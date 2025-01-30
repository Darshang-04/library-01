import React, { useState, useEffect } from 'react';
import Userlayout from '@/u_layout';
import { useRouter } from 'next/router';

export default function SingleEbook() {
    const router = useRouter();
    const { id } = router.query;
    const [ebook, setEbook] = useState()
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    useEffect(() => {
        if (!router.isReady || !id) return;

        const fetchBookDetails = async () => {
            try {
                const res = await fetch(`${backendUrl}/get-ebook/${id}`);
                const data = await res.json();

                if (res.status === 200) {
                    setEbook(data.book);
                    //   setRecommendations(data.recommendations)
                } else {
                    console.error(data.message || "Failed to fetch book details");
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        fetchBookDetails();
    }, [router.isReady, id]);

    const handleViewPDF = () => {
        router.push(`/component/library/clglibrary/admins/pdf-viewer/${id}`);
      };

    return (
        <div className='container'>
            {ebook ? (
                <div className='container'>
                    <h1 className="book-title">{ebook.title}</h1>
                    <div className="book-details">
                        {/* <Image src={isValidURL(bookdetails.book.PHOTO) ? bookdetails.book.PHOTO : defaultimage} alt={bookdetails.book.TITLE} className="book-image" width={200} height={200} /> */}
                        <div className="book-info">
                            <p><strong>Title:</strong> {ebook.title}</p>
                            <p><strong>Author:</strong> {ebook.author}</p>
                            <p><strong>Description:</strong> {ebook.description}</p>
                        </div>
                        <button
                            className={'button'}
                            onClick={handleViewPDF}
                        >
                            View PDF
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading book details...</p>
            )}
        </div>
    )
}

SingleEbook.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
