package swiss.alpinetech.exchange.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import swiss.alpinetech.exchange.domain.Order;

public class ExcelGenerator {

    public static ByteArrayInputStream ordersToExcel(List<Order> orders) throws IOException {
        String[] columns = {
            "idOrder",
            "refOrder",
            "createDate",
            "update_date",
            "close_date",
            "security_token_name",
            "symbol",
            "type",
            "limit_or_market",
            "volume",
            "price",
            "total_amount",
            "category_token",
            "status",
            "active",
            "username"
        };
        try(
            Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
        ){
            CreationHelper createHelper = workbook.getCreationHelper();

            Sheet sheet = workbook.createSheet("Orders");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.BLUE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);

            // Row for Header
            Row headerRow = sheet.createRow(0);

            // Header
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(order.getIdOrder());
                row.createCell(1).setCellValue(order.getRefOrder());
                row.createCell(2).setCellValue(order.getCreateDate().toString());
                row.createCell(3).setCellValue(order.getUpdateDate().toString());
                row.createCell(4).setCellValue(order.getCloseDate().toString());
                row.createCell(5).setCellValue(order.getSecurityToken() != null ? order.getSecurityToken().getName() : "" );
                row.createCell(6).setCellValue(order.getSymbol());
                row.createCell(7).setCellValue(order.getType().toString());
                row.createCell(8).setCellValue(order.getLimitOrMarket().toString());
                row.createCell(9).setCellValue(order.getVolume());
                row.createCell(10).setCellValue(order.getPrice());
                row.createCell(11).setCellValue(order.getTotalAmount());
                row.createCell(12).setCellValue(order.getCategoryToken().toString());
                row.createCell(13).setCellValue(order.getStatus().toString());
                row.createCell(14).setCellValue(order.isActive());
                row.createCell(15).setCellValue(order.getUser() != null ? order.getUser().getLogin() : "" );
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
