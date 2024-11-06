import React from 'react';
import sampleImage from '../../assets/owtg.jpg';
import developerImage1 from '../../assets/1x1jalatest.jpg';
import developerImage2 from '../../assets/1x1falatest.jpg';
import developerImage3 from '../../assets/1x1thlatest.jpg';
import developerImage4 from '../../assets/1x1jllatest.jpg';
import '../../styles/studentAbout.css';

const programmers = [
    { name: "Jerome E. Acac", age: 21, contact: "(123) 456-7890", email: "jeromeacac@example.com", image: developerImage1 },
    { name: "Florence Ayen Z. De Jesus", age: 22, contact: "(123) 456-7890", email: "ayendejesus@example.com", image: developerImage2 }, // Same as John Doe
    { name: "Trunks S. Hernandez", age: 21, contact: "(555) 123-4567", email: "trunkshernandez@example.com", image: developerImage3 },
    { name: "Jericho M. Lafuente", age: 22, contact: "(555) 123-4567", email: "jericholafuente@example.com", image: developerImage4 }, // Same as Alice Johnson
];

const StudentAbout = () => {
    return (
        <div className="about-container">
            <div className="outer-box-reference">
                <div className="inner-box-reference">Reference</div>
                <div className="refe-container">
                    <div className="refe-image-container">
                        <img src={sampleImage} alt="Reference preview" className="refe-image" />
                    </div>
                    <div className="refe-details">
                        <p className="refe-description">
                            Step into a world where the pages of "Our Way to God" come to life! In this immersive adventure, you’ll explore the rich landscapes and captivating characters inspired by the beloved stories of [Author's Name]. As you embark on your quest, navigate through treacherous terrains, solve intricate puzzles, and forge alliances with iconic figures from the book. Your choices will shape the narrative, offering a unique twist on the classic tales you know and love. Will you rise as a hero or succumb to the shadows? Discover the magic hidden within the chapters of [Book Title] and experience a story like never before!
                        </p>
                    </div>
                </div>
            </div>

            <div className="outer-box-programmers">
                <div className="inner-box-programmers">Programmers Information</div>
                <div className="programmers-container">
                    {programmers.map((programmer, index) => (
                        <div key={index} className="programmer-info">
                            <div className="programmers-image-container">
                                <img src={programmer.image} alt={programmer.name} className="programmers-image" />
                            </div>
                            <div className="programmers-details">
                                <p><strong>Name:</strong> {programmer.name}</p>
                                <p><strong>Age:</strong> {programmer.age}</p>
                                <p><strong>Contact No:</strong> {programmer.contact}</p>
                                <p><strong>Email:</strong> {programmer.email}</p>
                            </div>
                            {/* Insert a line break after every two programmers */}
                            {(index + 1) % 2 === 0 && <div className="line-break" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentAbout;