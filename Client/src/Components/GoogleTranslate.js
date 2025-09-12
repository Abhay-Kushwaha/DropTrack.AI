import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Prevent duplicate script loading
        if (!document.getElementById("google-translate-script")) {
            const addScript = document.createElement("script");
            addScript.id = "google-translate-script";
            addScript.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            addScript.async = true;
            document.body.appendChild(addScript);

            // Define global init only once
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            includedLanguages:
                                "hi,bn,ta,te,mr,gu,kn,ml,or,pa,ur,en",
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        },
                        "google_translate_element"
                    );
                }
            };
        } else {
            // If script is already there, re-init
            if (window.googleTranslateElementInit) {
                window.googleTranslateElementInit();
            }
        }
    }, []);

    return (
        <div
            id="google_translate_element"
            className="h-10 overflow-hidden goog-te-gadget"
            style={{
                '& .goog-te-gadget': {
                    height: '40px',
                    overflow: 'hidden',
                    border: '1px solid black',
                    backgroundColor: 'black',
                },
                '& .goog-te-combo': {
                    height: '32px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'black',
                    color: '#4a5568',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: '#cbd5e0',
                    },
                    '&:focus': {
                        borderColor: '#3182ce',
                        boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)',
                    }
                },
                '& .goog-te-gadget-simple': {
                    border: 'none',
                    background: 'none',
                },
                '& .goog-te-gadget-simple img': {
                    display: 'none',
                },
                '& .goog-te-gadget-simple span': {
                    borderLeft: 'none !important',
                    fontSize: '14px',
                    color: '#4a5568',
                }
            }}
        />
    );
};

export default GoogleTranslate;