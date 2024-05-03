import { useState, useEffect } from 'react'
import useSignalR from "../useSignalR";
import { getSignedURL } from '@/actions';


export default function NewAuctionForm() {
    const { connection } = useSignalR("/r/auctionHub");
    useEffect(() => {
        if (!connection) {
        return
        }
        // listen for auctions from the server
        connection.on("ReceiveAuction", (auction) => {
        // from the server
        console.log("Auction from the server", auction)
        })

        return () => {
            connection.off("ReceiveAuction")
        }
    }, [connection])

    const [newAuctionName, setNewAuctionName] = useState('')
    const [newAuctionDescription, setNewAuctionDescription] = useState('')
    const [newAuctionImage, setNewAuctionImage] = useState('')
    const [newAuctionStartingPrice, setNewAuctionStartingPrice] = useState(0)
    const [newAuctionMinBiddingAmount, setNewAuctionMinBiddingAmount] = useState(0)
    const [file, setFile] = useState<File | undefined>(undefined)

    const computeSHA256 = async (file: File) => {
        const buffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
        return hashHex
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file)
            const url = URL.createObjectURL(file)
            setNewAuctionImage(url)
        } else {
            setFile(undefined)
            setNewAuctionImage('')
        }

    }

    const handleNewAuction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(file) {
            const checksum = await computeSHA256(file)
            const signedURLResult = await getSignedURL(file.type, file.size, checksum)
            if(!signedURLResult.success) {
                console.error(signedURLResult.error)
                return
            }
            const url = signedURLResult.success.url
            const urlData = new URL(url)
            const imageUrl = urlData.origin + urlData.pathname
            await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            })
        
            const result = await fetch('/api/auction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newAuctionName,
                    description: newAuctionDescription,
                    imageUrl: imageUrl,
                    startingPrice: newAuctionStartingPrice,
                    minBiddingAmount: newAuctionMinBiddingAmount
                })
            })
            await result.json()
            return result


        }

    }

    return (
        <div className="flex justify-center items-center h-auto bg-gray-100 ">
            <form onSubmit={handleNewAuction} className="bg-white p-2 rounded-lg">
                <div className="mb-2">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                    <input required type="text" id="name" name="name" placeholder='Item Name' value={newAuctionName} onChange={(e) => setNewAuctionName(e.target.value)}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="mb-2">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
                    <textarea required id="description" name="description" value={newAuctionDescription} onChange={(e) => setNewAuctionDescription(e.target.value)}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"></textarea>
                </div>
                {/* image file with a preview of the image */}
                <div className="mb-2">
                    <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Image:</label>
                    <input type="file" id="image" name="image" accept="image/*, video/*" onChange={handleFileChange}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 mb-2" />
                    {/* if file is image, show image preview, else if it is video show video preview    */}
                    {file && file.type.startsWith("image/") && <img src={newAuctionImage} alt="Preview" className="w-full" />}      
                    {file && file.type.startsWith("video/") && <video src={newAuctionImage} controls className="w-full" />}
                </div>
                <div className="mb-2">
                    <label htmlFor="startingPrice" className="block text-gray-700 font-bold mb-2">Starting Price:</label>
                    <input required type="number" id="startingPrice" name="startingPrice" value={newAuctionStartingPrice} onChange={(e) => setNewAuctionStartingPrice(Number(e.target.value))}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="mb-2">
                    <label htmlFor="minBiddingAmount" className="block text-gray-700 font-bold mb-2">Min Bidding Increment:</label>
                    <input required type="number" id="minBiddingAmount" name="minBiddingAmount" value={newAuctionMinBiddingAmount} onChange={(e) => setNewAuctionMinBiddingAmount(Number(e.target.value))}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add New Auction Item</button>
                </div>                                

            </form>

            </div>

    ) 
}
